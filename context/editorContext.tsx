"use client";

import { templates } from "@/components/elementTemplates";
import { IconProps } from "@/components/Icons";
import React, { createContext, useContext, useEffect, useState } from "react";

interface EditorOptions {
	icon?: React.FC<IconProps>;
}

interface BlockOptions {
	imageLink?: string;
}

interface BlockProperties {
	editor?: EditorOptions;
	block?: BlockOptions;
}


// Define the Block interface
export interface Block {
	id: number;
	type: string;
	options: BlockProperties;
	label: string;
	content: string;
	parent_id?: number | null;
	children?: Block[];
}

// Define the EditorContext type
interface EditorContextType {
	selected: number | null; // Replace 'any' with a specific type if needed
	setSelected: React.Dispatch<React.SetStateAction<number | null>>;
	selectedType: string | null; // Replace 'any' with a specific type if needed
	setSelectedType: React.Dispatch<React.SetStateAction<string | null>>;
	blocks: Block[];
	setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
	elementTemplates: Block[];
	draggedTemplate: Block | null;
	setDraggedTemplate: (data: Block | null) => void;
	handleBlockUpdate: (updatedList: Block[], parentId?: number | null) => void;
	handleTemplateAdd: (template: Block, parentId?: number | null) => void;
}

// Create the context
const EditorContext = createContext<EditorContextType | null>(null);

// EditorProvider component
export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [selected, setSelected] = useState<number | null>(null);
	const [selectedType, setSelectedType] = useState<string | null>(null);
	console.log(selected)
	const elementTemplates: Block[] = templates;
	const [restApiData, setRestApiData] = useState([
		{
			link: "https://jsonplaceholder.typicode.com/posts",
			name: "posts"
		},
		{
			link: "https://jsonplaceholder.typicode.com/users",
			name: "users"
		}
	])
	const [fetchedData, setFetchedData] = useState([])
	const [blocks, setBlocks] = useState<Block[]>([
		{
			id: 1,
			type: "container",
			label: "Container-1",
			content: "New Container",
			children: [
				{
					id: 2,
					type: "container",
					label: "Container-2",
					content: "New Container",
					children: [
						{
							id: 3,
							type: "text",
							label: "text-1",
							content: "New Text Element",
							parent_id: 2,
							options: {},
						},
					],
					parent_id: 1,
					options: {},
				},
			],
			parent_id: null,
			options: {},
		},
	]);

	const [draggedTemplate, setDraggedTemplate] = useState<Block | null>(null);

	const findAndRemoveItem = (
		blocks: Block[],
		id: number
	): { newBlocks: Block[]; removedItem: Block | null } => {
		let removedItem: Block | null = null;

		const traverse = (items: Block[]): Block[] =>
			items.reduce<Block[]>((result, item) => {
				if (item.id === id) {
					removedItem = { ...item };
				} else {
					const newItem = { ...item };
					if (newItem.children) {
						newItem.children = traverse(newItem.children);
					}
					result.push(newItem);
				}
				return result;
			}, []);

		return { newBlocks: traverse(blocks), removedItem };
	};

	const handleBlockUpdate = (
		updatedList: Block[],
		parentId: number | null = null
	): void => {
		setBlocks((prevBlocks) => {
			let newBlocks = [...prevBlocks];
			updatedList = updatedList.map((item) => {
				// If the item exists elsewhere in the tree, remove it first
				const searchResult = findAndRemoveItem(newBlocks, item.id);

				if (searchResult.removedItem) {
					newBlocks = searchResult.newBlocks;
					// Preserve the original item's properties while updating parent_id
					return {
						...searchResult.removedItem,
						parent_id: parentId,
					};
				}

				// If the item wasn't found elsewhere, it's new to this location
				return {
					...item,
					parent_id: parentId,
				};
			});

			// If this is a top-level update, return the new list
			if (parentId === null) {
				return updatedList;
			}

			// Otherwise, find the parent container and update its children
			const updateChildren = (blocks: Block[]): Block[] => {
				return blocks.map((block) => {
					if (block.id === parentId) {
						return { ...block, children: updatedList };
					}
					if (block.children) {
						return {
							...block,
							children: updateChildren(block.children),
						};
					}
					return block;
				});
			};

			return updateChildren(prevBlocks);
		});
	};

	const generateUniqueId = (): number => {
		const ids: number[] = [];
		const collectIds = (items: Block[]): void => {
			items.forEach((item) => {
				ids.push(item.id);
				if (item.children) collectIds(item.children);
			});
		};
		collectIds(blocks);
		return ids.length > 0 ? Math.max(...ids) + 1 : 1;
	};

	const handleTemplateAdd = (
		template: Block,
		parentId: number | null = null
	): void => {
		const newItem: Block = {
			id: generateUniqueId(),
			type: template.type,
			content: template.content,
			parent_id: parentId,
			children: template.children ? [] : undefined,
			options: { ...template.options },
			label: template.label,
		};

		setBlocks((prevBlocks) => {
			const addToParent = (items: Block[]): Block[] =>
				items.map((item) => {
					if (item.id === parentId) {
						return {
							...item,
							children: [...(item.children || []), newItem],
						};
					}
					if (item.children) {
						return { ...item, children: addToParent(item.children) };
					}
					return item;
				});

			return parentId === null
				? [...prevBlocks, newItem]
				: addToParent(prevBlocks);
		});
	};

	useEffect(() => {
		if (restApiData.length > 0) {
			const fetchData = async () => {
				const dataPromises = restApiData.map(async (element) => {
					const response = await fetch(element.link);
					return response.json();
				});
				const data = await Promise.all(dataPromises);
console.log("first")
				// Use a functional update to ensure you're using the latest state
				setFetchedData(prevFetchedData => ({
					...prevFetchedData,
					...data.reduce((acc, item, index) => {
						const name = restApiData[index].name ? restApiData[index].name : `api-${index + 1}`;
						acc[name] = item;
						return acc;
					}, {})
				}));
			};

			fetchData();
		}
	}, [restApiData]); // Dependency array to trigger effect when restApiData changes

	console.log(fetchedData);

	return (
		<EditorContext.Provider
			value={{
				selected,
				setSelected,
				selectedType,
				setSelectedType,
				blocks,
				setBlocks,
				elementTemplates,
				draggedTemplate,
				setDraggedTemplate,
				handleBlockUpdate,
				handleTemplateAdd,
			}}
		>
			{children}
		</EditorContext.Provider>
	);
};

// Custom hook
export default function useEditor(): EditorContextType {
	const context = useContext(EditorContext);
	if (!context) {
		throw new Error("useEditor must be used within an EditorProvider");
	}
	return context;
}
