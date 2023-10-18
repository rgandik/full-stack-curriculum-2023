function Greeting(props) {

    return(
        <h1>Hello {props.name ? props.name : "Default"}!</h1>
    )
}

export default Greeting;