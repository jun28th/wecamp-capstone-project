// Small pill text button used for the Edit / Delete (or Remove) actions on a
// row. tone picks the color: "edit" is the brand accent, "delete" is the error red.
const TONE_CLASS = {
  edit: "text-primary-deep hover:bg-primary-tint",
  delete: "text-error-text hover:bg-error/12",
};

export default function RowActionButton({ tone = "edit", children, ...rest }) {
  return (
    <button
      className={`cursor-pointer rounded-pill px-2.5 py-1.5 font-body text-[13px] font-semibold transition-[background] duration-150 ease-[ease-out] ${TONE_CLASS[tone]}`}
      {...rest}
    >
      {children}
    </button>
  );
}
