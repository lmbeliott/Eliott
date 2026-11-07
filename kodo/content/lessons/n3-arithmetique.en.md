Number theory problems often hide very large numbers: 10¹², 10¹⁸. Trying everything one by one is then impossible. A few classic tools compute quickly, without ever going through these numbers.

## The GCD with Euclid's algorithm

The GCD (greatest common divisor) of a and b is the largest integer that divides both. Euclid's algorithm relies on one remark: the common divisors of a and b are the same as those of b and `a mod b`. So we replace (a, b) by (b, a mod b) until b is 0.

```python
def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a

print(gcd(84, 36))   # 12
```

```cpp
long long gcd(long long a, long long b) {
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}
// gcd(84, 36) is 12
```

It is very fast: O(log(min(a, b))), about a hundred steps at most even for 10¹⁸. The LCM (least common multiple) follows from it: `lcm(a, b) = a / gcd(a, b) × b`. Dividing **before** multiplying avoids an overflow in C++.

## The sieve of Eratosthenes

To find all the primes up to N, all the numbers are written down, then for each number p still present (it is prime), its multiples are crossed out. Crossing out starts at p × p: the smaller multiples have a prime divisor smaller than p, so they are already crossed out. And stopping at p ≤ √N is enough.

```python
n = 50
is_prime = [True] * (n + 1)
is_prime[0] = is_prime[1] = False
p = 2
while p * p <= n:
    if is_prime[p]:
        for m in range(p * p, n + 1, p):
            is_prime[m] = False
    p += 1
print([x for x in range(n + 1) if is_prime[x]])   # 2, 3, 5, ..., 47
```

```cpp
int n = 50;
vector<bool> is_prime(n + 1, true);
is_prime[0] = is_prime[1] = false;
for (int p = 2; p * p <= n; p++) {
    if (is_prime[p]) {
        for (int m = p * p; m <= n; m += p) is_prime[m] = false;
    }
}
// the x such that is_prime[x]: 2, 3, 5, ..., 47
```

The sieve costs O(N log log N), almost O(N). The same idea works on an interval [L, R] far from 0: crossing out the multiples of the primes up to √R is enough.

## Counting divisors

The divisors of n come in pairs: if d divides n, then so does n / d, and one of the two is at most √n. To find all the divisors, it is enough to try d from 1 to √n: O(√n) instead of O(n).

```python
def number_of_divisors(n):
    total = 0
    d = 1
    while d * d <= n:
        if n % d == 0:
            total += 1 if d * d == n else 2   # d and n / d
        d += 1
    return total

print(number_of_divisors(36))   # 9
```

```cpp
int number_of_divisors(long long n) {
    int total = 0;
    for (long long d = 1; d * d <= n; d++) {
        if (n % d == 0) total += (d * d == n) ? 1 : 2;   // d and n / d
    }
    return total;
}
// number_of_divisors(36) is 9
```

Another useful trick: among the numbers from 1 to n, exactly `n // d` are multiples of d. To count divisors over many numbers at once, the reasoning can go divisor by divisor.

## Computing modulo M

When a result is huge, problems often ask for its remainder modulo M. Remainders can be computed along the way: `(a + b) mod M` and `(a × b) mod M` only depend on `a mod M` and `b mod M`. So reduce after **every** operation, and the numbers stay small. For a subtraction, add M before reducing, so as not to get a negative remainder in C++. Careful: **division** does not work like this; `(a / b) mod M` cannot be computed from the remainders.

## Fast exponentiation

Computing A^N mod M with N multiplications is too slow for N = 10¹⁸. We use A^N = (A^(N/2))² when N is even, and A^N = A^(N−1) × A when N is odd: N is at least halved every two calls.

```python
def power(a, n, m):
    if n == 0:
        return 1 % m
    if n % 2 == 0:
        half = power(a, n // 2, m)
        return half * half % m
    return power(a, n - 1, m) * a % m

print(power(3, 10**18, 1000))
```

```cpp
long long power(long long a, long long n, long long m) {
    if (n == 0) return 1 % m;
    if (n % 2 == 0) {
        long long half = power(a, n / 2, m);
        return half * half % m;
    }
    return power(a, n - 1, m) * (a % m) % m;
}
```

This is O(log N). In C++, if M ≤ 10⁹, the product of two remainders is below 10¹⁸ and fits in a `long long`. This way of cutting in half can be reused for other repeated sums and products.

## Key takeaways

- Euclid's algorithm computes the GCD in O(log n); the LCM is `a / gcd(a, b) × b`.
- The sieve crosses out the multiples of each prime p starting from p × p; going up to √N is enough.
- Divisors come in pairs (d, n / d): all of them are found in O(√n).
- Modulo M, reduce after every addition and every multiplication; never divide.
- Fast exponentiation computes A^N mod M in O(log N) by cutting N in half.
