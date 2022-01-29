# Travelling Salesman Problem Using Genetic Algorithms. (TSP - GA)

## The Problem

The TSP is a classic optimisation problem. The goal of which is to minimize the sum of lengths of the line segments that intersect all 'N' vertex points atleast once and atmost twice i.e. a path. The standard measure of distance is taken to be Euclidean distance. This seemingly simple problem statement is quite deceptive as
the sample space of distinct paths exhibits factorial growth, N!/2 to be precise. For just 11 points the sample space of paths would be roughly 20 million. 

## Using Genetic Algorithms

Clearly since this is a problem that has a comically large sample space brute force techniques are completely out of the question and in order to get anywhere near the optimal path we need to be crafty.

One way of going about the TSP is using genetic algorithms. The idea here is encapsulated in the following list.

- Initialize a reasonably sized population consisting of random set of paths. 
- Assign higher fitness scores to paths that minimize distance.
- Create a mating pool in which paths that scored higher are better represented.
- Create a child population from the mating pool using a gene cross-over function.
- Mutate a small section of the child population to account for the disparity between the population size and the sample space of thr TSP. ( Helps avoid local minima due to lack of enough initial genetic diversity in the population)
- Using the child population as the current population repeat the process.


