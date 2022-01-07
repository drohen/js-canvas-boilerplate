# Code design boilerplate

[This branch](https://github.com/drohen/js-canvas-boilerplate/tree/canvas) contains all of the files from [the interactive canvas section](https://javascript.best/posts/creating-canvas-input-system-for-prototyping-interactive-graphics/) of [the Canvas Boilerplate tutorial](https://javascript.best/posts/how-to-create-and-use-an-html-2d-canvas-boilerplate-project/). This code builds upon the foundation within the code design branch.

## Set up

- Make sure you've followed the early steps to install the following on your system:
	- NodeJS
	- VSCode (with required extensions)
	- Git
- Clone this repo, and checkout this branch
- Install the dependencies: `npm i`
- Run the development server: `npm start`

## Notes

- Read the code to see how it all works.
- Remove the example code and update the `render.ts` draw call to suit your needs.
- Create different state based on the input events.
- Add listeners for different types of input.
- When you're ready to push the code to a production environment, build the code with: `npm run build`.

## LICENSE

Copyright 2021 [DROHEN](https://github.com/drohen)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.