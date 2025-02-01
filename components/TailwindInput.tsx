import Popover from "./Popover";
import { useEffect, useRef, useState } from "react";
import { tailwindCSS } from "./tailwindClasses";

interface TailwindInputProps {
	update: (value: string) => void;
	val: string;
	label?: string;
}

const TailwindInput: React.FC<TailwindInputProps> = ({
	update,
	val,
	label = "Add Classes",
}) => {
	const [inputValue, setInputValue] = useState<string>(val || "");
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
	const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(0);

	const inputRef = useRef<HTMLTextAreaElement | null>(null);
	const activeSuggestionRef = useRef<HTMLLIElement | null>(null);
	// const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		setInputValue(val);
	}, [val]);

	const tailwindClasses: string[] = tailwindCSS;

	// Debounce mechanism
	const debounce = <T extends (...args: string[]) => void>(
		func: T,
		delay: number
	): ((...args: Parameters<T>) => void) => {
		let timer: NodeJS.Timeout;
		return (...args: Parameters<T>) => {
			clearTimeout(timer);
			timer = setTimeout(() => func(...args), delay);
		};
	};

	const debounceFilterSuggestions = debounce((value: string) => {
		const currentWord = value.split(" ").pop()?.trim(); // Get the last word
		if (!currentWord) {
			setSuggestions([]);
			setShowSuggestions(false);
			return;
		}

		let filtered: string[] = [];
		if (currentWord.includes(":")) {
			// Handle modifier filtering
			const [modifier, rest] = currentWord.split(":");
			const prefix = `${modifier}:`;
			filtered =
				rest?.length > 0
					? tailwindClasses
						.filter((className) =>
							className.toLowerCase().startsWith(rest.toLowerCase())
						)
						.map((className) => `${prefix}${className}`)
					: tailwindClasses.map((className) => `${prefix}${className}`);
		} else if (/^[a-z]+$/i.test(currentWord)) {
			// Handle shorthand matching
			const pattern = currentWord.toLowerCase();
			filtered = tailwindClasses.filter((className) => {
				const words = className.split("-");
				return pattern.split("").every((char, index) => {
					return words[index] && words[index].startsWith(char);
				});
			});
		} else {
			// Handle substring matching
			const pattern = currentWord.toLowerCase();
			filtered = tailwindClasses.filter((className) =>
				className.toLowerCase().includes(pattern)
			);
		}

		// Keep suggestions visible even if no matches
		if (filtered.length === 0) {
			filtered = tailwindClasses.filter((className) =>
				className.toLowerCase().includes(currentWord.toLowerCase())
			);
		}

		setSuggestions(filtered);
		setShowSuggestions(true); // Always show suggestions until space or clear
		setActiveSuggestionIndex(0);
	}, 300);

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setInputValue(value);
		update(value);
		debounceFilterSuggestions(value);
	};

	// Scroll active suggestion into view
	useEffect(() => {
		if (activeSuggestionRef.current) {
			activeSuggestionRef.current.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
			});
		}
	}, [activeSuggestionIndex]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "ArrowDown") {
			setActiveSuggestionIndex((prevIndex) =>
				prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
			);
		} else if (e.key === "ArrowUp") {
			setActiveSuggestionIndex((prevIndex) =>
				prevIndex > 0 ? prevIndex - 1 : prevIndex
			);
		} else if (e.key === "Enter" && suggestions.length > 0) {
			e.preventDefault();
			selectSuggestion(suggestions[activeSuggestionIndex]);
		}
	};

	const selectSuggestion = (suggestion: string) => {
		const words = inputValue.split(" ");
		words.pop();
		const updatedValue = [...words, suggestion].join(" ").trim();
		setInputValue(updatedValue);
		update(updatedValue);
		setShowSuggestions(false);
		setActiveSuggestionIndex(0);
		inputRef.current?.focus();
	};

	const handleSuggestionClick = (suggestion: string) => {
		selectSuggestion(suggestion);
	};

	const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
		if (!e.relatedTarget || !(e.relatedTarget as HTMLElement).closest("ul")) {
			setShowSuggestions(false);
		}
	};

	return (
		<div className="relative w-full" onBlur={handleBlur}>
			<label
				htmlFor="tailwind-input"
				className="text-[11px] text-primary-900 dark:text-primary-900">
				{label}
			</label>
			<Popover
				position="bottom"
				className="min-w-[120px] max-w-[220px] w-full"
				isOpen={showSuggestions}
				content={
					<ul
						id="suggestion-list"
						className="max-h-60 overflow-y-auto bg-primary-200 text-primary-800 rounded shadow-md"
						role="listbox">
						{suggestions.map((suggestion, index) => (
							<li
								key={index}
								ref={index === activeSuggestionIndex ? activeSuggestionRef : null}
								onClick={() => handleSuggestionClick(suggestion)}
								className={`p-2 cursor-pointer text-[11px] ${index === activeSuggestionIndex
									? "bg-primary-600 text-white"
									: "hover:bg-primary-600 hover:text-white"
									}`}
								aria-selected={index === activeSuggestionIndex}
								role="option">
								{suggestion}
							</li>
						))}
						{showSuggestions && suggestions.length === 0 && (
							<div className="p-2 cursor-pointer text-[11px]">No Class Found</div>
						)}
					</ul>
				}
			>
				<textarea
					id="tailwind-input"
					ref={inputRef}
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					placeholder="Type Tailwind classes..."
					className="w-full h-max text-[11px] row-span-3 p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
					// aria-expanded={showSuggestions}
					aria-owns="suggestion-list"
				/>
			</Popover>
			{/* {showSuggestions && (
				
			)} */}
		</div>
	);
};

export default TailwindInput;
