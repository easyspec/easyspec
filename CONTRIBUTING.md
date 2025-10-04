# Contributing

## Setup

```bash
git clone <repo-url>
npm install
npm run dev
```

## Workflow

1. Create branch: `git checkout -b feature/your-feature`
2. Make changes
3. Write tests
4. Run checks:
   ```bash
   npm test
   npm run lint
   npm run format
   npx tsc --noEmit
   ```
5. Commit: `feat: add feature` (conventional commits)
6. Push and create PR

## PR Checklist

- [ ] Tests pass
- [ ] Code formatted
- [ ] TypeScript checks pass
- [ ] Conventional commit messages

## Principles

- **KISS**: Keep it simple
- **DRY**: Don't repeat yourself
- **Tests**: Required for utils/hooks

## License

By contributing, you agree your contributions are licensed under MIT.
