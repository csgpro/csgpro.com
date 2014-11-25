# Markdown Tutorial

Markdown is a way of writing text that gets automatically transformed into
websites. Simply put, Markdown is the best way to write content for the
Internet. There is very small learning curve, and once you get it, it'll enable
you to get your thoughts down without worrying about styling. Have you ever been
in writing in *Word* and had the indentation for bulleted lists go wonky on
you? Have you nearly pulled your hair out? I have, and that doesn't happen with
Markdown.

## Headers

Headers should be on their own line and start with the `#` symbol. 

You write:

    # Header 1
    ## Header 2
    ### Header 3
    #### Header 4
    ##### Header 5

And this comes out:

# Header 1
## Header 2
### Header 3
#### Header 4
##### Header 5

## Paragraphs

Paragraphs work just like you probably expect. They are simply just text
surrounded by whitespace. There's plenty of whitespace in markdown, embrace it.

## Links

You write:

    Here is a Markdown link to [Google](http://google.com).

And this comes out:

Here is a Markdown link to [Google](http://google.com).

## Bold, italics, and inline code

Instead of pushing a button on the toolbar, like in *Word*, you simply put a few
extra characters around a word or words.

You write:

    Now some inline markup like _italics_,  **bold**, and `code()`.

And this comes out:

Now some inline markup like _italics_,  **bold**, and `code()`.

## Images

Pictures are inserted similarly to links. You just add a `!` before them. The
images need to be available via a URL. Just like any image you ever see online.


On the actual blog post page, there will be a lightbox effect autmatically
applied to all your images.


You write:

    ![picture alt](http://csgprod.azurewebsites.net/img/logo.svg "Hover text")

And this comes out:

![picture alt](http://csgprod.azurewebsites.net/img/logo.svg "Hover text")

## Blockquotes

Block quotes are useful when... quoting someone. They are lines of text that
start with the `>` character.

You write:

    > Blockquotes are like quoted text in email replies
    >> And, they can be nested

And this comes out:

> Blockquotes are like quoted text in email replies
>> And, they can be nested

## Lists

### Bulleted lists

You write:

    - Bullet lists are easy too
    - Another one
    - Another one

And this comes out:

- Bullet lists are easy too
- Another one
- Another one

### Numbered lists

You write:

    1. A numbered list
    2. Which is numbered
    3. With periods and a space
    1. The order of the numbers doesn't matter

And this comes out:

1. A numbered list
2. Which is numbered
3. With periods and a space
1. The order of the numbers doesn't matter

## Code formatting

When you are writing a post and want to differentiate that some text is code,
you can either do that `inline` or as a block.

### Inline

You write:

    You can get the square root of a number with the `sqrt()` function

And this comes out:

You can get the square root of a number with the `sqrt()` function

### Block

You write:

    ```
    function sqrt(number) {
      return Math.pow(number, 0.5);
    }
    ```

And this comes out:

```
function sqrt(number) {
  return Math.pow(number, 0.5);
}
```

## Horizontal rules

You write:

    --------------------------

And this comes out:

--------------------------

## Tables

Tables are more advanced. The spacing doesn't matter so much as the characters.
I think an example explains this best.

You write:

    | Header | Header | Right Aligned  |
    | ------ | ------ | -----: |
    |  Cell  |  Cell  |   $10  |
    |  Cell  |  Cell  |   $20  |

And this comes out:

| Header | Header | Right Aligned  |
| ------ | ------ | -----: |
|  Cell  |  Cell  |   $10  |
|  Cell  |  Cell  |   $20  |

- Outer pipes `|` on tables are optional
- Colons used for alignment (right versus left)