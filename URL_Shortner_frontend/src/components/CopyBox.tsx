import React, {useState} from "react";


type CopyBoxProps = {
    text: string;
};

const CopyBox: React.FC<CopyBoxProps> = ({ text }) => {
    type copyText = "Copy" | "Copied" ;
    const [copyTextIndicator, setCopyTextIndicator] = useState<copyText>("Copy");
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text).then(()=> setCopyTextIndicator("Copied"));
            setTimeout(()=> setCopyTextIndicator("Copy"),5000);
            // optional: show toast / set local "Copied!" state here
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div
            onClick={handleCopy}
            className="
        cursor-pointer
        rounded-md
        border
        border-white/20
        bg-gray-900/60
        px-3 py-2
        text-sm text-gray-100
        flex items-center justify-between gap-2
      "
            title="Click to copy"
        >
            <span className="truncate">{text}</span>
            <span className="text-xs text-blue-400 shrink-0">{copyTextIndicator}</span>
        </div>
    );
};

export default CopyBox;