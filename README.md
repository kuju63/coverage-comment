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
- uses: actions/checkout@v2
  with:
    repository: kuju63/coverage-comment
    token: ${{ secrets.TOKEN }}
    ref: v1
    path: ${{ github.workspace }}/.github/actions
- name: Test coverage
  uses: ./.github/actions
  with:
    token: ${{ github.token }}
    paths: csharp/test/Sample.Tests/TestResults/**/coverage.cobertura.xml
```

### Full using

```yaml
- uses: actions/checkout@v2
  with:
    repository: kuju63/coverage-comment
    token: ${{ secrets.TOKEN }}
    ref: v1
    path: ${{ github.workspace }}/.github/actions
- name: Test coverage
  uses: ./.github/actions
  with:
    token: ${{ github.token }}
    paths: csharp/test/Sample.Tests/TestResults/**/coverage.cobertura.xml
    type: 'cobertura'
    debug: '0'
```
