import { Link, useLocation } from "react-router-dom";
import { Button } from "semantic-ui-react";

export default function NextPageBtn(props) {
    return (
        <div className="button-container">
            <Button className="button-element" as={Link} to={props.page} state={props.state} >{props.btnText}</Button>
        </div>
    )
} 