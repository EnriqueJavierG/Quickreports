import React from 'react'
import { Route, Redirect } from "react-router-dom";
function ClientRoute({children, ...rest}) {
    return (
        <Route
            {...rest}
            render={({ location }) =>
                localStorage.getItem("role") ==='client' ? (
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

export default ClientRoute
