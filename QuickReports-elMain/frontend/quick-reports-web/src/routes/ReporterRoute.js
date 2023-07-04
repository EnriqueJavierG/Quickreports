import React from 'react'
import { Route, Redirect } from "react-router-dom";
function ReporterRoute({children, ...rest}) {
    return (
        <Route
            {...rest}
            render={({ location }) =>
                localStorage.getItem("role") ==='reporter' ? (
                children
                ) : (
                        <Redirect
                        to={{
                            //return to login if tokenb not found
                            pathname: "/login",
                            state: { from: location }
                        }}
                        />
                    )
                }
        />
    )
}

export default ReporterRoute
