import { useRouteError, isRouteErrorResponse, Link } from 'react-router'
import { Button } from './ui/button'

export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Pagină negăsită</h1>
          <p className="text-muted-foreground mb-6">
            Ne pare rău, pagina pe care o căutați nu există.
          </p>
          <Button asChild>
            <Link to="/">Înapoi acasă</Link>
          </Button>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h1 className="text-4xl font-bold mb-4">{error.status}</h1>
        <p className="text-muted-foreground mb-6">{error.statusText}</p>
        <Button asChild>
          <Link to="/">Înapoi acasă</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Oops!</h1>
      <p className="text-muted-foreground mb-6">
        A apărut o eroare neașteptată.
      </p>
      <Button asChild>
        <Link to="/">Înapoi acasă</Link>
      </Button>
    </div>
  )
}