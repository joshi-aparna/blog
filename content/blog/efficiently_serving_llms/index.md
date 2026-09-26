---
title: Notes from Efficiently Serving LLMs
date: 2026-09-26 00:00:00-05:30
description: DeepLearning.io # Add post description (optional)
img: ./efficiently_serving_llms.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [tech] # add tag
---

# Notes from Efficiently Serving LLMs
Course: Efficiently Serving LLMs
Platform: DeepLearning.io


## Deep Learning

### Text Generation

1. **Input text is tokenized** into numbers (called tensors).

2. The tensor is fed to a model that gives the **top-k predictions for the next token**.

3. Take the top prediction and append it to the input, either until the maximum number of tokens are created or a stop token is reached.

4. For a sequence without padding, the attention mask can contain 1 for every token.

5. During attention, the model computes Key (K) and Value (V) tensors. These can be stored in a KV cache for each transformer layer and reused during subsequent token generation.

6. Cache the K-V matrix and pass that to the model, so that only the incremental value can be computed instead of starting computation from the first token while calculating attention.

   *The K-V cache contains the values that have already been computed and can be reused for subsequent tokens.*

### Prefill and Decode

7. **Prefill phase** — process the entire input prompt and build the initial KV cache. The output is used to generate the first token. (slowest)

   **Decode phase** — generate subsequent tokens one at a time. (can use K-V cache)

---

## Batching

8. **Batching:** Parallelly process N sequences of tokens.

   If the number of tokens in each sequence is different, use padding tokens on the left and set the attention mask value to \`0\`, so that the model does not pay attention to it.

   For example:

   \`\`\`
   [The] [cat] [sat]
   [The] [home] [on] [the]
   [A]   [boy]
   \`\`\`

   After padding:

   \`\`\`
   [PAD] [PAD] [The] [cat] [sat]
   [PAD] [The] [home] [on] [the]
   [PAD] [PAD] [PAD] [A] [boy]
   \`\`\`

   The model can then generate the next token for each sequence.

9. Here, in the output from the model, keep all the elements in the batch.

   Next, instead of taking \`argmax\` of the entire output, take the **max of each row** to choose the next token for that sequence.

10. If you do this efficiently for every loop to see if a sequence is ready to be removed from the batch or a new one can be added, that's continuous batching. This can improve throughput.

<img width="1024" height="1536" alt="image" src="https://github.com/user-attachments/assets/a9c784df-f406-43f0-87c8-089dfdc9d151" />


