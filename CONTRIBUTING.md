# Contributing to Capacitor Version Manager

Thank you for your interest in contributing to the Capacitor Version Manager! 🎉

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/InfoArkitectura/capacitor-version-plugin.git
   cd capacitor-version-plugin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## Project Structure

```
capacitor-version-plugin/
├── src/
│   ├── definitions.ts       # TypeScript interfaces
│   ├── index.ts            # Main plugin export
│   ├── plugin.ts           # Plugin registration
│   ├── web.ts             # Web implementation
│   ├── cli/               # CLI implementation
│   └── __tests__/         # Test files
├── android/               # Android native code
├── ios/                   # iOS native code
├── dist/                  # Built files
└── docs/                  # Documentation
```

## Development Workflow

### 1. Making Changes

- Create a new branch for your feature/fix
- Make your changes
- Add tests for new functionality
- Update documentation if needed

### 2. Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Fix linting issues
npm run fmt
```

### 3. Building

```bash
# Build the project
npm run build

# Watch for changes during development
npm run watch
```

### 4. Testing Native Code

#### Android
```bash
# Verify Android build
npm run verify:android
```

#### iOS
```bash
# Verify iOS build  
npm run verify:ios
```

### 5. CLI Testing

```bash
# Build and test CLI locally
npm run build
npm link

# Test CLI commands
cap-version --help
cap-version init
cap-version update 1.0.0
```

## Code Standards

### TypeScript

- Use strict TypeScript configuration
- Provide proper type definitions
- Document public APIs with JSDoc comments
- Follow existing code patterns

### Native Code

#### Android (Java)
- Follow Android coding conventions
- Use proper error handling
- Add appropriate comments
- Handle null/undefined values

#### iOS (Swift)
- Follow Swift coding conventions
- Use proper error handling
- Add appropriate comments
- Handle optional values properly

### CLI

- Use commander.js for CLI structure
- Provide helpful error messages
- Include progress indicators for long operations
- Support both interactive and non-interactive modes

## Testing Guidelines

### Unit Tests

- Write tests for all public methods
- Test error conditions
- Mock external dependencies
- Aim for high code coverage

### Integration Tests

- Test CLI commands end-to-end
- Test native plugin functionality
- Test Trapeze integration

### Manual Testing

- Test on real devices when possible
- Test different platform versions
- Test with various project configurations

## Documentation

### Code Documentation

- Document all public APIs
- Include usage examples
- Explain complex logic
- Keep comments up to date

### User Documentation

- Update README.md for new features
- Add examples for new functionality
- Update CLI help text
- Create migration guides for breaking changes

## Release Process

1. **Version Bump**
   ```bash
   npm version patch|minor|major
   ```

2. **Update Changelog**
   - Add new features, bug fixes, breaking changes
   - Follow semantic versioning guidelines

3. **Build and Test**
   ```bash
   npm run build
   npm test
   npm run verify
   ```

4. **Publish**
   ```bash
   npm publish
   ```

## Issue Guidelines

### Bug Reports

Include:
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Relevant code snippets
- Error messages

### Feature Requests

Include:
- Clear description of the feature
- Use cases and benefits
- Proposed API design (if applicable)
- Willingness to implement

## Pull Request Guidelines

### Before Submitting

- [ ] Tests pass locally
- [ ] Code follows project conventions
- [ ] Documentation is updated
- [ ] Commits are clean and descriptive

### PR Description

Include:
- Clear description of changes
- Motivation for the changes
- Testing performed
- Breaking changes (if any)
- Related issues

### Review Process

1. Automated checks must pass
2. At least one maintainer review
3. All feedback addressed
4. Documentation updated if needed

## Getting Help

- 💬 [GitHub Discussions](https://github.com/InfoArkitectura/capacitor-version-plugin/discussions)
- 🐛 [Issue Tracker](https://github.com/InfoArkitectura/capacitor-version-plugin/issues)
- 📖 [Documentation](README.md)

## Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes
- Project documentation

Thank you for contributing! 🙌
