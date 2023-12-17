function Greeting(props) {
    function toggleColor(e) {
        const currentClass = e.target.className

        if (currentClass === "defaultColor") {
            e.target.className = "hoverColor"
        } else {
            e.target.className = "defaultColor"
        }
    }

    return(
        <h1 onClick={toggleColor}>Hello {props.name ? props.name : "Default"}</h1>
    )
}

export default Greeting;