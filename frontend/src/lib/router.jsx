import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'

const RouterContext = createContext(null)

export function BrowserRouter({ children }) {
    const [location, setLocation] = useState(() => ({
        pathname: typeof window !== 'undefined' ? window.location.pathname : '/',
        search: typeof window !== 'undefined' ? window.location.search : '',
        hash: typeof window !== 'undefined' ? window.location.hash : '',
    }))

    useEffect(() => {
        const handlePopState = () => {
            setLocation({
                pathname: window.location.pathname,
                search: window.location.search,
                hash: window.location.hash,
            })
        }

        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [])

    const navigate = useCallback((to, options = {}) => {
        if (typeof to === 'number') {
            window.history.go(to)
            return
        }

        const targetUrl = typeof to === 'string' ? to : (to?.pathname || '/')
        if (options.replace) {
            window.history.replaceState(options.state || null, '', targetUrl)
        } else {
            window.history.pushState(options.state || null, '', targetUrl)
        }

        setLocation({
            pathname: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash,
        })
    }, [])

    const contextValue = useMemo(() => ({
        location,
        navigate,
    }), [location, navigate])

    return (
        <RouterContext.Provider value={contextValue}>
            {children}
        </RouterContext.Provider>
    )
}

export function useLocation() {
    const context = useContext(RouterContext)
    if (!context) {
        return {
            pathname: typeof window !== 'undefined' ? window.location.pathname : '/',
            search: typeof window !== 'undefined' ? window.location.search : '',
            hash: typeof window !== 'undefined' ? window.location.hash : '',
        }
    }
    return context.location
}

export function useNavigate() {
    const context = useContext(RouterContext)
    if (!context) {
        return (to, options) => {
            if (typeof to === 'number') {
                window.history.go(to)
            } else if (options?.replace) {
                window.location.replace(to)
            } else {
                window.location.assign(to)
            }
        }
    }
    return context.navigate
}

export function Navigate({ to, replace = true }) {
    const navigate = useNavigate()
    useEffect(() => {
        navigate(to, { replace })
    }, [navigate, to, replace])
    return null
}

export function Route({ path, element }) {
    return element || null
}

function matchPath(routePath, currentPath) {
    if (!routePath) return false
    if (routePath === '*') return true

    const normRoute = (routePath.replace(/\/+$/, '') || '/').toLowerCase()
    const normCurrent = (currentPath.replace(/\/+$/, '') || '/').toLowerCase()

    return normRoute === normCurrent
}

export function Routes({ children }) {
    const location = useLocation()
    const currentPath = location.pathname

    const routes = React.Children.toArray(children).filter(Boolean)

    let match = null
    for (const child of routes) {
        if (!React.isValidElement(child)) continue
        const { path, element } = child.props
        if (matchPath(path, currentPath)) {
            match = element
            break
        }
    }

    return match
}

export function Link({ to, replace, onClick, children, className, ...rest }) {
    const navigate = useNavigate()

    const handleClick = (e) => {
        if (onClick) onClick(e)
        if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.altKey && !e.ctrlKey && !e.shiftKey) {
            e.preventDefault()
            navigate(to, { replace })
        }
    }

    return (
        <a href={to} onClick={handleClick} className={className} {...rest}>
            {children}
        </a>
    )
}

export function NavLink({ to, replace, className, children, ...rest }) {
    const location = useLocation()
    const isActive = location.pathname.toLowerCase() === (to || '').toLowerCase()

    const resolvedClassName = typeof className === 'function' ? className({ isActive }) : (
        [className, isActive ? 'active' : ''].filter(Boolean).join(' ')
    )

    return (
        <Link to={to} replace={replace} className={resolvedClassName} {...rest}>
            {typeof children === 'function' ? children({ isActive }) : children}
        </Link>
    )
}

export default {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate,
    Link,
    NavLink,
}
