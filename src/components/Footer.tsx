export function Footer() {
  const commitHash = typeof __COMMIT_HASH__ !== 'undefined' ? __COMMIT_HASH__ : 'dev';
  const buildTime = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : '';
  const buildDate = buildTime ? new Date(buildTime).toLocaleDateString() : '';

  return (
    <footer className="mt-12 border-t border-border/50 py-6 text-xs text-muted-foreground">
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-medium">Pokomplete</span>
            <span className="hidden sm:inline">·</span>
            <a
              href="https://github.com/laputacloudco/pokomplete"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline underline-offset-2"
            >
              GitHub
            </a>
          </div>

          <div className="flex items-center gap-3 text-center sm:text-right">
            <span>
              Data from{' '}
              <a
                href="https://pokemontcg.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors underline underline-offset-2"
              >
                Pokemon TCG API
              </a>
              {' + '}
              <a
                href="https://pokeapi.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors underline underline-offset-2"
              >
                PokeAPI
              </a>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {commitHash !== 'dev' && (
              <a
                href={`https://github.com/laputacloudco/pokomplete/commit/${commitHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono hover:text-foreground transition-colors"
              >
                {commitHash}
              </a>
            )}
            {buildDate && (
              <>
                <span>·</span>
                <span>{buildDate}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
