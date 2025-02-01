"use client";

import { templates } from "@/components/elementTemplates";
import { IconProps } from "@/components/Icons";
import { supabase } from "@/hooks/supabaseClient";
import { useUser } from "@clerk/nextjs";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface EditorOptions {
	icon?: React.FC<IconProps>;
}

export interface BlockOptions {
	imageLink?: string;
	tagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | "p" | "caption" | "span" | 'div';
	className?: string;
	text?: string | false;
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
	selected: Block | null; // Replace 'any' with a specific type if needed
	setSelected: React.Dispatch<React.SetStateAction<Block | null>>;
	selectedType: string | null; // Replace 'any' with a specific type if needed
	setSelectedType: React.Dispatch<React.SetStateAction<string | null>>;
	blocks: Block[];
	setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
	elementTemplates: Block[];
	draggedTemplate: Block | null;
	setDraggedTemplate: (data: Block | null) => void;
	handleBlockUpdate: (updatedList: Block[], parentId?: number | null) => void;
	handleTemplateAdd: (template: Block, parentId?: number | null) => void;
	onChangeUpdateBlockOptions: (blocks: Block[], blockId: number, key: keyof BlockOptions, value: string) => Block[];
	handleSave: () => void;
	setName: (data: string) => void;
	setSlug: (data: string) => void;
	setStatus: (data: string) => void;
	name: string
	slug: string
	status: string
	pageId: number | null
	setPageId: (data: number | null) => void
	responsive: string
	setResponsive: (data: string) => void
	responsiveBlock: Block[]
	setResponsiveBlock: (data: Block[]) => void
	findBlockById: (blocks: Block[], id: number) => Block | null
}

// Create the context
const EditorContext = createContext<EditorContextType | null>(null);

// EditorProvider component
export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { user } = useUser()
	const [selected, setSelected] = useState<Block | null>(null);
	const [selectedType, setSelectedType] = useState<string | null>(null);

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
	const [page, setPage] = useState({})
	const [pageId, setPageId] = useState(null)
	const [name, setName] = useState("")
	const [slug, setSlug] = useState("")
	const [status, setStatus] = useState("")
	const [editorData, setEditorData] = useState({})
	const [fetchedData, setFetchedData] = useState([])
	const [responsive, setResponsive] = useState('lg')
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
							options: {
								block: {
									tagName: "p",
									className: "",
									text: "Dummy Text Content...",
								},
							},
						},
					],
					parent_id: 1,
					options: {
						block: {
							tagName: "div",
							className: "",
						},
					},
				},
			],
			parent_id: null,
			options: {
				block: {
					tagName: "div",
					className: "",
				},
			},
		},
	]);
	const [responsiveBlock, setResponsiveBlock] = useState(blocks)
	
	useEffect(() => {
		const updateClassNames = (blocks: Block[]): Block[] => {
			return blocks.map((block) => {
				// Update className if it exists in block options
				if (block.options?.block?.className) {
					const updatedClassName = block.options.block.className
						.replace(/\bsm:/g, "@sm:")
						.replace(/\bmd:/g, "@md:")
						.replace(/\blg:/g, "@lg:")
						.replace(/\bxl:/g, "@xl:")
						.replace(/\b2xl:/g, "@2xl:")
						.replace(/\b3xl:/g, "@3xl:")
						.trim(); // Remove extra spaces if needed

					block = {
						...block,
						options: {
							...block.options,
							block: {
								...block.options.block,
								className: updatedClassName,
							},
						},
					};
				}

				// Recursively update child blocks
				if (block.children && block.children.length > 0) {
					return { ...block, children: updateClassNames(block.children) };
				}

				return block;
			});
		};
		setResponsiveBlock(updateClassNames(blocks));
	}, [responsive, blocks]);

console.log(responsiveBlock)
	const findBlockById = (blocks: Block[], id: number): Block | null => {
		for (const block of blocks) {
			if (block.id === id) {
				return block;
			}
			if (block.children && block.children.length > 0) {
				const found = findBlockById(block.children, id);
				if (found) return found;
			}
		}
		return null;
	};


	console.log(blocks)
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

		// Automatically set the newly added block as selected
		setSelected(newItem);
	};

	// Recursive function to update a block or its children
	const onChangeUpdateBlockOptions = (blocks: Block[], blockId: number, key: keyof BlockOptions, value: string): Block[] => {
		return blocks.map((block) => {
			if (block.id === blockId) {
				// Update the block options
				return {
					...block,
					options: {
						...block.options,
						block: {
							...block.options.block,
							[key]: value,
						},
					},
				};
			}

			// If the block has children, recursively update them
			if (block.children && block.children.length > 0) {
				return {
					...block,
					children: onChangeUpdateBlockOptions(block.children, blockId, key, value),
				};
			}

			// Return the block unchanged if no match
			return block;
		});
	};

	// const handleSave = async () => {
	// 	if (Object.keys(page).length === 0) {
	// 		setPage({
	// 			editorData: editorData,
	// 			blocks: blocks
	// 		});
	// 	} else {
	// 		if (pageId === null) {
	// 			console.log("done")
	// 			await saveToSupabase(); // Call saveToSupabase only if page is not empty
	// 		} else {
	// 			console.log("not done")
	// 			const { data, error } = await supabase
	// 				.from('pages')
	// 				.update({
	// 					name: name,
	// 					slug: slug,
	// 					status: status,
	// 					page_data: page, // Ensure this has valid JSON or structure
	// 					user_id: user?.id
	// 				})
	// 				.eq('id', pageId)
	// 				.select(); // Request the inserted data

	// 			if (error) {
	// 				console.error("Error inserting data:", error);
	// 			} else {
	// 				console.log("Inserted data:", data);
	// 			}
	// 		}
	// 	}
	// };

	// // useEffect(() => {
	// // 	if (Object.keys(page).length > 0) {
	// // 		saveToSupabase(); // Call saveToSupabase when page is set
	// // 	}
	// // }, [page]);

	// const saveToSupabase = async () => {
	// 	const { data, error } = await supabase
	// 		.from('pages')
	// 		.insert([
	// 			{
	// 				name: name,
	// 				slug: slug,
	// 				status: status,
	// 				page_data: page, // Ensure this has valid JSON or structure
	// 				user_id: user?.id
	// 			}
	// 		])
	// 		.select(); // Request the inserted data

	// 	if (error) {
	// 		console.error("Error inserting data:", error);
	// 	} else {
	// 		console.log("Inserted data:", data);
	// 		setPageId(data[0].id);
	// 	}
	// };

	const handleSave = async () => {
		try {
			const pageData = {
				name,
				slug,
				status,
				page_data: { blocks },
				user_id: user?.id
			};

			let result;

			if (pageId === null) {
				result = await supabase
					.from('pages')
					.insert([pageData])
					.select()
					.single();
			} else {
				result = await supabase
					.from('pages')
					.update(pageData)
					.eq('id', pageId)
					.select()
					.single();
			}

			const { data, error } = result;

			if (error) throw error;

			if (data) {
				setPageId(data.id);
			}
		} catch (error) {
			console.error("Error saving page:", error);
		}
	};

	useEffect(() => {
		const fetchPageData = async () => {
			if (pageId) {
				const { data, error } = await supabase
					.from('pages')
					.select('*')
					.eq('id', pageId)
					.single();

				if (error) {
					console.error("Error fetching page:", error);
					return;
				}

				if (data) {
					setName(data.name);
					setSlug(data.slug);
					setStatus(data.status);
					if (data.page_data?.blocks) {
						setBlocks(data.page_data.blocks);
					}
				}
			}
		};

		fetchPageData();
	}, [pageId]);

	console.log(pageId)

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
				onChangeUpdateBlockOptions,
				handleSave,
				name,
				setName,
				slug,
				setSlug,
				status,
				setStatus,
				pageId,
				setPageId,
				responsive,
				setResponsive,
				responsiveBlock,
				setResponsiveBlock,
				findBlockById
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
