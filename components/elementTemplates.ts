import { Block } from "@/context/editorContext";
import { ListBulletIcon } from "@heroicons/react/24/outline";
import { AlignSelectionIcon, AppleReminderIcon, DashedLine01Icon, EdgeStyleIcon, GroupItemsIcon, Heading01Icon, Image01Icon, PencilEdit01Icon, TextIcon } from "hugeicons-react";


export const templates: Block[] = [
	{
		id: 0,
		type: "list",
		label: "List",
		content: "Creative Director",
		options: {
			editor: {
				icon: ListBulletIcon,
			},
		},
	},
	{
		id: 0,
		type: "iconBlock",
		label: "Icon Block",
		content: "Creative  Studio LLC",
		options: {
			editor: {
				icon: PencilEdit01Icon,
			},
		},
	},
	{
		id: 0,
		type: "divider",
		label: "Divider",
		content: "https://createllc.com",
		options: {
			editor: {
				icon: DashedLine01Icon,
			},
		},
	},
	{
		id: 0,
		type: "heading",
		label: "Heading",
		content: "Dummy Heading",
		options: {
			editor: {
				icon: Heading01Icon,
			},
			block: {
				tagName: "h2",
				className: "",
				text: "Dummy Heading",
			},
		},
	},
	{
		id: 0,
		type: "image",
		label: "Image",
		content: "",
		options: {
			editor: {
				icon: Image01Icon,
			},
			block: {
				imageLink:
					"https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
				className: "",
			},
		},
	},
	{
		id: 0,
		type: "text",
		content: "New Text Element",
		options: {
			editor: {
				icon: EdgeStyleIcon,
			},
			block: {
				tagName: "p",
				className: "",
				text: "Dummy Text Content...",
			},
		},
		label: "Text Block",
	},
	{
		id: 0,
		type: "container",
		content: "New Container",
		children: [],
		options: {
			editor: {
				icon: AlignSelectionIcon,
			},
		},
		label: "Container",
	},
];
