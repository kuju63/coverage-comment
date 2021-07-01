# coverage-comment action

[![build-test](https://github.com/kuju63/coverage-comment/actions/workflows/test.yml/badge.svg)](https://github.com/kuju63/coverage-comment/actions/workflows/test.yml)

## Input

### `token`

**Required** Set github.token for comment to PR.

### `paths`

**Required** Coverage file path. It allow glob pattern.

### `type`

**Optional** Coverage format. Currently supported "cobertura" only.

### `debug`

**Optional** Dry run mode when set 1.

## Output

None

## How to use

### Simple using

```yaml
- name: Test coverage
  uses: kuju63/coverage-comment
  with:
    token: ${{ github.token }}
    paths: csharp/test/Sample.Tests/TestResults/**/coverage.cobertura.xml
```

### Full using

```yaml
- name: Test coverage
  uses: kuju63/coverage-comment
  with:
    token: ${{ github.token }}
    paths: csharp/test/Sample.Tests/TestResults/**/coverage.cobertura.xml
    type: 'cobertura'
    debug: '0'
```
