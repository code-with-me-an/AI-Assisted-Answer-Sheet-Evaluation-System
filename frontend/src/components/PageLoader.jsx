import '../style/PageLoader.css'

export function PageLoader({ message = 'Loading...', subtitle, inline = false }) {
    return (
        <div
            className={`page-loader-container ${inline ? 'inline' : ''}`}
            role="status"
            aria-busy="true"
            aria-live="polite"
        >
            <div className="page-loader-spinner" aria-hidden="true" />
            <div className="page-loader-text">
                <p className="page-loader-message">{message}</p>
                {subtitle && <p className="page-loader-subtitle">{subtitle}</p>}
            </div>
        </div>
    )
}

export function ErrorState({
    title = 'Unable to Load Data',
    message = 'An unexpected error occurred while fetching information.',
    onRetry,
    inline = false,
}) {
    return (
        <div
            className={`page-error-container ${inline ? 'inline' : ''}`}
            role="alert"
        >
            <div className="page-error-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            </div>
            <h3 className="page-error-title">{title}</h3>
            <p className="page-error-message">{message}</p>
            {onRetry && (
                <button
                    type="button"
                    className="page-error-retry-btn"
                    onClick={onRetry}
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                    </svg>
                    Retry
                </button>
            )}
        </div>
    )
}

export default PageLoader
