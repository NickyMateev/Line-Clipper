# <img src="images/logo128.png" align="center"> Line Clipper

**LineClipper** is a Chrome Extension which aims to optimize a software developer's
flow between the browser and the IDE when executing file retrieval.
This particular extension works on the GitHub source control platform.

## Motivation

A lot of IDEs provide quick find capabilities where you can specify a file path
and the IDE would open that file for you. Furthermore, you can also specify a line number
of said file at which you'd like to go to. Example:

`api/controllers/base_controller.go:73`

The following would take us to the `base_controller.go` file on line 73 in the *api/controllers* directory.

When working with GitHub and especially when making code reviews it's common for a developer
to jump from the browser to the IDE and vice versa. Often the developer would look at a file
and would want to quickly find and open that file at a particular point (line). To achieve this
today the individual would have to go over the following steps:

1. Copy file path by selecting the copy button at the top of the file (in some perspectives there isn't even any copy button and you have to select and copy the path manually)
2. Move his attention back to the critical piece of code and remember the line number of interest
3. Go to the IDE and trigger quick find
4. Paste the file path that was copied
5. Remember to also append and write the line number of interest
6. Execute search

## Solution

This extension tries to optimize this flow by providing simplistic functionality which copies both the
file path and also appends the corresponding line number to it. All an individual has to do is click
on the line number of interest. In this way we optimize the above flow not only in steps, but also in
mental effort. You can now focus on what you want to do and not worry about petty details which break flow:

1. Copy line number by clicking the number of the line in the file of interest
2. Go to the IDE and trigger quick find
3. Paste the file path that was copied (it includes the appended line number)
4. Execute search

## Features:

The extension focuses on doing one thing and do it well - copy file paths with their respective line numbers to your clipboard when clicking on specific line numbers while viewing any
type of file with line numbering on GitHub.

#### Simplistic - just click on the desired line number:

<img src="promotional/line_focus_promotional.png" align="center">

#### While doing code review:

<img src="promotional/review_focus_promotional.png" align="center">

#### During conversation:

<img src="promotional/conversation_focus_promotional.png" align="center">

#### When going through repository files:

<img src="promotional/file_focus_promotional.png" align="center">


### FAQ

Q: *Does this work only when traversing a GitHub project's file tree and looking at different files?*

A: No, it works for **every page** on GitHub which has a file with lines in it. You can copy lines from
the GitHub Pull request diff perspective when you're looking at the file diffs or at the main page of a
pull request where sometimes we see some code snippets which have been commented. You can also copy line numbers
when you're going through old commits and looking around at the files.

Q: *Does it work for all GitHub installations or just the public *https://github.com* installation?*

A: The extension works on all kinds of GitHub installations public/private as long as the domain contains
the word *github* in it.
