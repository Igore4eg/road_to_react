const Button = (props) => {
    const { onClick, className = "", children } = props;
    return (
        <button onClick={onClick} className={className} type="button">
            {children}
        </button>
    );
}

export default Button;