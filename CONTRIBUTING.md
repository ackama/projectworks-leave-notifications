# Contributing 

Although we are always happy to make improvements, we also welcome changes and
improvements from the community!

Have a fix for a problem you've been running into or an idea for a new feature
you think would be useful? Here's what you need to do:

1. [Read and understand the Code of Conduct](#code-of-conduct).
1. Fork this repo and clone your fork to somewhere on your machine.
1. Read up on [how to run the tests](#running-tests), and [the code style we use
   in this project](#code-style).
1. Cut a new branch and write a failing test for the feature or bugfix you plan
   on implementing.
1. [Make sure your branch is well managed as you go
   along](#managing-your-branch). API](#documentation).
1. Push to your fork and submit a pull request.
1. [Ensure that the test suite passes in CI and make any necessary changes to
   your branch to bring it to green.](#continuous-integration)

Although we maintain this code in our free time, we try to respond to
contributions in a timely manner. Once we look at your pull request, we may give
you feedback. For instance, we may suggest some changes to make to your code to
fit within the project style or discuss alternate ways of addressing the issue
in question. Assuming we're happy with everything, we'll then bring your changes
into main. Now you're a contributor!

---

## Code of Conduct

If this is your first time contributing, please read the [Code of Conduct]. We
want to create a space in which everyone is allowed to contribute, and we
enforce the policies outline in this document.

[Code of Conduct]:
https://github.com/ackama/projectworks-leave-notifications/blob/main/CODE_OF_CONDUCT.md

### Tests

We do not yet have tests for this project, as it is under active development.
When we add tests, we are likely to make `PW_URL` configurable via environment
variable so that we can mock HTTP requests and assert against expected output. 

If you would like to make a contribution by adding tests, even pending examples,
that would be appreciated.

## Code style

We use our own [ESLint
configuration](https://github.com/ackama/eslint-config-ackama) for our projects
to ensure we apply rules consistently that we feel leads to easy to read and
maintainable code. You can run the linter at any time using `npm run lint`. If
your code editor is set up with ESLint integration, you may find that linting is
automatic within your editor.

If you absolutely must skip a check, please include a comment explaining why it
is necessary, and some additional context demonstrating that you have
consistered alternative approaches.

## Managing your branch

* Use well-crafted commit messages, providing context if possible.
* Squash "WIP" commits and remove merge commits by rebasing your branch against
  `main`. We try to keep our commit history as clean as possible.

## Documentation

As you navigate the codebase, you may notice certain code blocks that are
prefaced with inline documentation. 

If your changes end up extending or updating important parts of these functions,
it helps greatly to update the docs at the same time for future developers and
other readers of the source code.


## Continuous integration

While running checks locally is a great way to check your work, this command
will only run your tests within your specific environment. Ultimately, though,
you'll want to ensure that your changes work in all possible environments. We
make use of a CI service to run tests and checks for us. Until we have some
tests, this is not set up, but we've included some content here to provide
context when we do have this set up.

What happens if the build fails in some way? Don't fear! Click on a failed job
and scroll through its output to determine the cause of the failure. You'll want
to make changes to your branch and push them up until the entire build is green.
It may take a bit of time, but overall it is worth it and it helps us immensely!

