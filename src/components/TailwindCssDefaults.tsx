// ボタンやカードのデフォルトスタイルを定義するコンポーネント

export function Button({children, onClick, disabled}: {children: React.ReactNode, onClick: () => void, disabled: boolean}) {
    return (
        <button
        className="bg-blue-500 hover:bg-blue-700 disabled:bg-slate-500 text-white font-bold py-2 px-4 rounded"
        onClick={onClick}
        disabled={disabled}>
            {children}
        </button>
    );
}

export function NumberInput({value, onChange}: {value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}) {
    return (
        <input
            type="number"
            value={value}
            onChange={onChange}
            className="border border-gray-300 rounded px-2 py-1"
        />
    );
}