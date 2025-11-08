/**
 * sum_to_n_a
 * 
 * This version uses a simple for loop.
 * It starts from 1 and keeps adding up until it reaches n.
 * It’s the most straightforward way to do it.
 * 
 * Example:
 * sum_to_n_a(5) -> 1 + 2 + 3 + 4 + 5 = 15
 */
var sum_to_n_a = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
      sum += i;
    }
    return sum;
  };
  
  
  /**
   * sum_to_n_b
   * 
   * This one uses the math formula for the sum of the first n numbers:
   *    n * (n + 1) / 2
   * It’s much faster because it doesn’t need a loop — just one calculation.
   * 
   * Example:
   * sum_to_n_b(5) -> (5 * 6) / 2 = 15
   */
  var sum_to_n_b = function(n) {
    return n * (n + 1) / 2;
  };
  
  
  /**
   * sum_to_n_c
   * 
   * This version uses recursion.
   * It keeps calling itself until it reaches 0, then adds everything up on the way back.
   * It’s elegant but not ideal for very large numbers because of recursion limits.
   * 
   * Example:
   * sum_to_n_c(5) -> 5 + 4 + 3 + 2 + 1 = 15
   */
  var sum_to_n_c = function(n) {
    if (n <= 0) return 0;
    return n + sum_to_n_c(n - 1);
  };
  
  
  // --- Test the functions ---
  const testValues = [5, 10, 100];
  
  testValues.forEach(n => {
    console.log(`n = ${n}`);
    console.log(`sum_to_n_a(${n}) =`, sum_to_n_a(n));
    console.log(`sum_to_n_b(${n}) =`, sum_to_n_b(n));
    console.log(`sum_to_n_c(${n}) =`, sum_to_n_c(n));
    console.log('---------------------------');
  });
