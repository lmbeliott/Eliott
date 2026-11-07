How many divisors does 720,720 have? What is the remainder of 2^(10¹⁸) divided by 10⁹ + 7? For which x does 17 × x leave remainder 1 when divided by 3,120? These questions all rely on a few tools: **prime numbers**, which are the building blocks of all integers, and **modular arithmetic**, which lets us handle gigantic numbers through their remainders.

Level 3 presented Euclid's algorithm and fast exponentiation, with their proofs. This chapter builds on them: the sieve of Eratosthenes, prime factorization, number and sum of divisors, the extended Euclidean algorithm, modular inverses and congruences, not forgetting the overflow traps specific to C++.

## The sieve of Eratosthenes

An integer `n ≥ 2` is **prime** if it has no positive divisor other than 1 and itself; 1 is not prime. To find all primes up to `n`, testing each number separately is slow. The **sieve of Eratosthenes** works the other way round: start from an array where all numbers from 2 to `n` are marked "prime", and for each `p` still marked, cross out its multiples.

```python
def crible(n):
    # premier[k] is True if and only if k is prime (0 <= k <= n)
    premier = [True] * (n + 1)
    premier[0] = premier[1] = False
    p = 2
    while p * p <= n:
        if premier[p]:
            for multiple in range(p * p, n + 1, p):
                premier[multiple] = False
        p += 1
    return premier

premier = crible(100)
liste = [k for k in range(101) if premier[k]]
print(len(liste), liste[-5:])
print(sum(crible(10**6)))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

// premier[k] is true if and only if k is prime (0 <= k <= n)
vector<bool> crible(int n) {
    vector<bool> premier(n + 1, true);
    premier[0] = premier[1] = false;
    for (long long p = 2; p * p <= n; p++) {
        if (premier[p]) {
            for (long long multiple = p * p; multiple <= n; multiple += p) {
                premier[multiple] = false;
            }
        }
    }
    return premier;
}

int main() {
    vector<bool> premier = crible(100);
    vector<int> liste;
    for (int k = 0; k <= 100; k++) {
        if (premier[k]) liste.push_back(k);
    }
    cout << liste.size() << " ";
    for (int i = liste.size() - 5; i < (int) liste.size(); i++) cout << liste[i] << " ";
    cout << "\n";
    vector<bool> grand = crible(1000000);
    int compte = 0;
    for (bool b : grand) compte += b;
    cout << compte << "\n";
    return 0;
}
```

The program prints `25 [73, 79, 83, 89, 97]`: there are 25 primes up to 100. Then `78498`, the number of primes up to one million, obtained instantly.

**Two remarks make the sieve correct and fast.** First, we cross out the multiples of `p` starting from `p²`: a smaller multiple, `k × p` with `k < p`, has a prime factor smaller than `p` and has already been crossed out. Second, we stop when `p² > n`. This is the key property of the whole chapter: **a composite integer `m` has a prime factor at most √m**. Indeed, if `m = a × b` with `1 < a ≤ b`, then `a × a ≤ a × b = m`, so `a ≤ √m`, and any prime factor of `a` works.

**Correctness.** A crossed-out number is a multiple `k × p` with `k ≥ p ≥ 2`: it is composite. Conversely, a composite `m ≤ n` has a prime factor `p ≤ √m ≤ √n`; when the loop reaches `p`, it is still marked (a prime is never crossed out, since it is a multiple of no smaller number except 1), and `m`, a multiple of `p` at least `p²`, gets crossed out. At the end, the marked numbers are exactly the primes.

**Cost.** For each prime `p ≤ √n`, we make about `n / p` operations. The total is `n × (1/2 + 1/3 + 1/5 + 1/7 + …)`, a sum over the primes only. Level 3 showed that the sum of `1/k` over all `k` up to `n` is about `ln n`; restricted to primes, it is only about `ln(ln n)` (we admit this result), that is about 3 for `n = 10⁹`. The sieve is in **O(n log log n)**: almost linear.

## The smallest prime factor

A variant of the sieve stores, for each `x`, its **smallest prime factor** `pf[x]`. Proceed in the same way, but instead of crossing out a multiple, write `p` in it if it has no factor yet. Then factorizing any `x ≤ n` is immediate: divide by `pf[x]`, then start again with the quotient.

```python
N = 1000
pf = [0] * (N + 1)          # pf[x]: smallest prime factor of x (0 if x is prime)
p = 2
while p * p <= N:
    if pf[p] == 0:
        for m in range(p * p, N + 1, p):
            if pf[m] == 0:
                pf[m] = p
    p += 1

def facteurs(x):
    res = []
    while x > 1:
        q = pf[x] if pf[x] != 0 else x
        res.append(q)
        x //= q
    return res

print(facteurs(360), facteurs(997), facteurs(1000))
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

const int N = 1000;
vector<int> pf(N + 1, 0);   // pf[x]: smallest prime factor of x (0 if x is prime)

vector<int> facteurs(int x) {
    vector<int> res;
    while (x > 1) {
        int q = (pf[x] != 0) ? pf[x] : x;
        res.push_back(q);
        x /= q;
    }
    return res;
}

int main() {
    for (int p = 2; p * p <= N; p++) {
        if (pf[p] == 0) {
            for (int m = p * p; m <= N; m += p) {
                if (pf[m] == 0) pf[m] = p;
            }
        }
    }
    for (int x : {360, 997, 1000}) {
        for (int q : facteurs(x)) cout << q << " ";
        cout << "| ";
    }
    cout << "\n";
    return 0;
}
```

The program prints the factors `2 2 2 3 3 5` for 360, `997` (prime) and `2 2 2 5 5 5` for 1000. The first `p` writing into `pf[m]` is the smallest prime factor of `m`, because the `p` are handled in increasing order. Each division divides `x` by at least 2, so a factorization costs at most `log₂ x` steps. It is the ideal tool to factorize **many** numbers that are not too large.

## Factorizing by trial division

For a single number too large for a sieve, for example `n ≤ 10¹²`, try the divisors `d = 2, 3, 4, …` while `d × d ≤ n`, dividing `n` by `d` as many times as possible.

```python
def decomposition(n):
    # list of pairs (prime, exponent)
    res = []
    d = 2
    while d * d <= n:
        if n % d == 0:
            e = 0
            while n % d == 0:
                n //= d
                e += 1
            res.append((d, e))
        d += 1
    if n > 1:                   # what remains is prime
        res.append((n, 1))
    return res

print(decomposition(360))
print(decomposition(600851475143))
```

```cpp
#include <iostream>
#include <utility>
#include <vector>
using namespace std;

// list of pairs (prime, exponent)
vector<pair<long long, int>> decomposition(long long n) {
    vector<pair<long long, int>> res;
    for (long long d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            int e = 0;
            while (n % d == 0) {
                n /= d;
                e++;
            }
            res.push_back({d, e});
        }
    }
    if (n > 1) {                // what remains is prime
        res.push_back({n, 1});
    }
    return res;
}

int main() {
    for (long long n : {360LL, 600851475143LL}) {
        for (auto& pe : decomposition(n)) cout << pe.first << "^" << pe.second << " ";
        cout << "\n";
    }
    return 0;
}
```

The program finds 360 = 2³ × 3² × 5 and 600,851,475,143 = 71 × 839 × 1,471 × 6,857. **Correctness.** Invariant: at each turn, the current `n` has no prime factor strictly less than `d`. A `d` dividing `n` is therefore prime (otherwise one of its prime factors, smaller, would divide `n`). On exit, `d × d > n`: if `n > 1`, it has no prime factor at most √n, so it is prime. **Cost**: at most √n turns, that is 10⁶ for `n = 10¹²`; this is halved by testing only 2 and then the odd numbers.

## Number and sum of divisors

Every integer `n ≥ 2` can be written in a **unique** way as a product of primes: `n = p₁^e₁ × p₂^e₂ × … × p_k^e_k`. A divisor of `n` then has the form `p₁^f₁ × … × p_k^f_k` with `0 ≤ fᵢ ≤ eᵢ`, and two different choices of exponents give two different divisors. We deduce:

- the **number of divisors**: `d(n) = (e₁ + 1) × (e₂ + 1) × … × (e_k + 1)`, since each exponent is chosen among `eᵢ + 1` values;
- the **sum of divisors**: `σ(n) = (1 + p₁ + … + p₁^e₁) × … × (1 + p_k + … + p_k^e_k)`, because expanding this product gives each divisor exactly once.

For 360 = 2³ × 3² × 5, we find `d = 4 × 3 × 2 = 24` divisors, with sum `σ = 15 × 13 × 6 = 1170`. The sum `1 + p + … + p^e` is also `(p^(e+1) − 1) / (p − 1)`. These formulas turn an impossible enumeration (10¹² candidates) into a factorization.

## The extended Euclidean algorithm

**Bézout's theorem.** For all integers `a, b ≥ 0`, not both zero, there are integers `u` and `v` (positive or negative) such that `a × u + b × v = GCD(a, b)`. Euclid's algorithm computes them along the way. If `b = 0`, `GCD(a, 0) = a = a × 1 + 0 × 0`. Otherwise, compute recursively `u'` and `v'` such that `b × u' + (a mod b) × v' = g`, then replace `a mod b` by `a − ⌊a/b⌋ × b`: `a × v' + b × (u' − ⌊a/b⌋ × v') = g`. So just take `u = v'` and `v = u' − ⌊a/b⌋ × v'`.

```python
def euclide_etendu(a, b):
    # returns (g, u, v) with a × u + b × v = g = GCD(a, b)
    if b == 0:
        return a, 1, 0
    g, u, v = euclide_etendu(b, a % b)
    return g, v, u - (a // b) * v

print(euclide_etendu(240, 46))
g, u, v = euclide_etendu(17, 3120)
print(g, u, u % 3120)
```

```cpp
#include <iostream>
using namespace std;

// returns g = GCD(a, b) and fills u, v with a × u + b × v = g
long long euclideEtendu(long long a, long long b, long long& u, long long& v) {
    if (b == 0) {
        u = 1;
        v = 0;
        return a;
    }
    long long u1, v1;
    long long g = euclideEtendu(b, a % b, u1, v1);
    u = v1;
    v = u1 - (a / b) * v1;
    return g;
}

int main() {
    long long u, v;
    long long g = euclideEtendu(240, 46, u, v);
    cout << g << " " << u << " " << v << "\n";
    g = euclideEtendu(17, 3120, u, v);
    cout << g << " " << u << " " << ((u % 3120) + 3120) % 3120 << "\n";
    return 0;
}
```

The program prints `(2, -9, 47)`: indeed 240 × (−9) + 46 × 47 = −2,160 + 2,162 = 2. Then `1 -367 2753`: 17 × (−367) + 3,120 × v = 1, and 17 × 2,753 = 46,801 = 15 × 3,120 + 1. Correctness is proved by induction, like the computation above; the recursion has the depth of Euclid's algorithm, a few dozen calls.

## Computing modulo M

We write `a ≡ b (mod M)` when `a` and `b` have the same remainder when divided by `M`, that is when `M` divides `a − b`. Remainders are compatible with the operations: `(a + b) mod M`, `(a − b) mod M` and `(a × b) mod M` only depend on `a mod M` and `b mod M`. So we can reduce at each step of a computation and keep the numbers small. This is not true for division: `6 ≡ 16 (mod 10)`, but `6/2 = 3` and `16/2 = 8` do not have the same remainder.

```python
print(-7 % 3, (-7) // 3)
m = 1000000007
print(pow(3, m - 2, m), 3 * pow(3, m - 2, m) % m)
```

```cpp
#include <iostream>
using namespace std;

long long puissance(long long a, long long n, long long m) {
    long long r = 1;
    a = a % m;
    while (n > 0) {
        if (n % 2 == 1) r = r * a % m;
        a = a * a % m;
        n = n / 2;
    }
    return r;
}

int main() {
    cout << -7 % 3 << " " << (-7) / 3 << "\n";
    cout << ((-7 % 3) + 3) % 3 << "\n";
    long long m = 1000000007;
    long long inv = puissance(3, m - 2, m);
    cout << inv << " " << 3 * inv % m << "\n";
    return 0;
}
```

Python prints `2 -3`: its remainder is always between 0 and `M − 1`. C++ prints `-1 -2`: its division truncates towards zero, and the remainder of a negative number is negative. After a subtraction, write `((x % M) + M) % M` in C++: the second line prints `2`, like Python. Finally, in C++, a product of two remainders below 10⁹ + 7 is at most about 10¹⁸ and fits in a `long long`: reduce **before** each multiplication.

## The modular inverse

An **inverse** of `a` modulo `M` is an integer `u` such that `a × u ≡ 1 (mod M)`. It replaces division: dividing by `a` modulo `M` means multiplying by `u`. **It exists if and only if `GCD(a, M) = 1`.** If `a × u + M × v = 1` (Bézout), then `a × u ≡ 1`; conversely, if `a × u ≡ 1`, then `a × u − 1` is a multiple of `M`, and every common divisor of `a` and `M` divides 1. The extended Euclidean algorithm therefore computes the inverse, brought back between 0 and `M − 1`: the inverse of 17 modulo 3,120 is 2,753.

When `M = p` is **prime**, there is something simpler. **Fermat's little theorem**: if `p` does not divide `a`, then `a^(p−1) ≡ 1 (mod p)`. Proof: the numbers `a, 2a, …, (p − 1)a` have nonzero and pairwise different remainders (if `ia ≡ ja`, then `p` divides `(i − j)a`, hence `i − j`, since `p` is prime and does not divide `a`). So they are the remainders `1, 2, …, p − 1` in another order, and their product gives `a^(p−1) × (p − 1)! ≡ (p − 1)! (mod p)`. Since `(p − 1)!` is coprime with `p`, it can be cancelled. Consequence: `a^(p−2)` is the inverse of `a`, computed by fast exponentiation. Another consequence: if `p` does not divide `a`, an exponent can be reduced modulo `p − 1`, since for `n = q × (p − 1) + r`, `a^n = (a^(p−1))^q × a^r ≡ a^r (mod p)`. The previous program prints `333333336 1`: 333,333,336 is the inverse of 3 modulo 10⁹ + 7, since 3 × 333,333,336 = 10⁹ + 8. Beware: Fermat only applies if `p` is prime and does not divide `a`.

## Linear congruences and LCM

To solve `a × x ≡ b (mod M)`, let `g = GCD(a, M)`. If `g` does not divide `b`, there is no solution, since `a × x − b` would have to be a multiple of `M`, hence of `g`. Otherwise, divide everything by `g`: `a/g` is coprime with `M/g`, it has an inverse `u` modulo `M/g`, and the solutions are the `x ≡ u × (b/g) (mod M/g)`; there are `g` of them between 0 and `M − 1`. A system of two congruences `x ≡ a₁ (mod m₁)`, `x ≡ a₂ (mod m₂)` reduces to such an equation by writing `x = a₁ + m₁ × k`: the second condition becomes `m₁ × k ≡ a₂ − a₁ (mod m₂)`. It determines `k` modulo `m₂ / g`, with `g = GCD(m₁, m₂)`, hence `x` modulo `m₁ × m₂ / g = LCM(m₁, m₂)`: when there are solutions, they form a single class modulo the LCM. This is the **Chinese remainder theorem**.

Similarly, the equation `a × x + b × y = c`, with integer unknowns `x` and `y`, has solutions if and only if `g = GCD(a, b)` divides `c`: extended Euclid gives `a × u + b × v = g`, which we multiply by `c / g`. If `(x₀, y₀)` is a solution, the others are the `(x₀ + k × b/g, y₀ − k × a/g)` for integer `k`. Indeed, `(a/g) × (x − x₀) = (b/g) × (y₀ − y)`, and since `a/g` is invertible modulo `b/g`, `b/g` divides `x − x₀`.

The **LCM** of `a` and `b` satisfies `GCD(a, b) × LCM(a, b) = a × b`: in the factorizations, the GCD takes the smaller exponent of each prime, the LCM the larger one. Compute `a / GCD(a, b) × b`, dividing **first**. Even so, the result can exceed 2⁶³ − 1: for `a = 10¹²` and `b = 10¹² − 1`, which are coprime, the LCM is about 10²⁴. In C++, the product overflows and gives a wrong number, without any message. To know whether `q × b` exceeds a limit `L`, test `q > L / b` before multiplying.

## Common mistakes

**Considering 1 as prime**, or forgetting to set `premier[0]` and `premier[1]` to false. A wrong sieve shows up by checking that there are 25 primes up to 100.

**Forgetting the last factor.** In trial division, the final rest `n > 1` is a prime factor; without the test `if n > 1`, 14 = 2 × 7 becomes 2.

**A sieve that is too large.** An array of 10⁹ cells exceeds the memory: beyond a few 10⁷, factorize by trial division, or target an interval.

**The negative remainder in C++.** `(a - b) % M` can be negative; a negative array index crashes the program. Add `M`.

**Overflow.** `a * b % M` with `a` and `b` not reduced, `a * b / gcd` for an LCM: reduce before multiplying, and test before exceeding.

**Misusing Fermat.** `pow(a, M - 2, M)` is the inverse only if `M` is prime and does not divide `a`; otherwise use extended Euclid, and check that the GCD is 1.

## A complete example

**Statement.** Compute the sum `1 + 1/2 + 1/3 + … + 1/N` modulo `P = 10⁹ + 7`, for `N ≤ 10⁵`. This sum is a fraction `a / b`; "modulo `P`", it means `a × b⁻¹ mod P`, where `b⁻¹` is the inverse of `b`.

**Idea.** The exact numerator and denominator have tens of thousands of digits. But the inverse is compatible with the operations: the sum of the fractions corresponds to the sum of the inverses `i⁻¹ mod P`. Since `P` is prime and `i < P`, Fermat gives `i⁻¹ = i^(P−2) mod P`.

```python
M = 1000000007
n = int(input())
somme = 0
for i in range(1, n + 1):
    somme = (somme + pow(i, M - 2, M)) % M    # 1/i modulo M (Fermat)
print(somme)
```

```cpp
#include <iostream>
using namespace std;

const long long M = 1000000007;

long long puissance(long long a, long long n) {
    long long r = 1;
    a = a % M;
    while (n > 0) {
        if (n % 2 == 1) r = r * a % M;
        a = a * a % M;
        n = n / 2;
    }
    return r;
}

int main() {
    int n;
    cin >> n;
    long long somme = 0;
    for (int i = 1; i <= n; i++) {
        somme = (somme + puissance(i, M - 2)) % M;   // 1/i modulo M (Fermat)
    }
    cout << somme << "\n";
    return 0;
}
```

**Checking by hand.** For `N = 3`, `1 + 1/2 + 1/3 = 11/6`. The program prints `833333341`, and indeed 6 × 833,333,341 = 5,000,000,046 = 5 × (10⁹ + 7) + 11: this number multiplied by 6 does give 11 modulo `P`.

**Correctness and cost.** If `x ≡ a/b` and `y ≡ c/d` in the above sense, then `x × b ≡ a` and `y × d ≡ c`, so `(x + y) × b × d ≡ a × d + c × b`, and `x + y` does represent `(ad + bc)/(bd)`. Each inverse costs one fast exponentiation, about thirty multiplications: O(N log P) in total.

## Key takeaways

- A composite integer `m` has a prime factor at most √m: this justifies the sieve (stop at √n, start at p²) and trial division up to √n.
- The sieve of Eratosthenes is in O(n log log n); its "smallest prime factor" variant then factorizes any `x ≤ n` in O(log x).
- If `n = p₁^e₁ × … × p_k^e_k`, then `d(n) = Π (eᵢ + 1)` and `σ(n) = Π (1 + pᵢ + … + pᵢ^eᵢ)`.
- Extended Euclid gives `u, v` with `a × u + b × v = GCD(a, b)` (Bézout); `a` is invertible modulo `M` if and only if `GCD(a, M) = 1`. If `M` is prime, Fermat gives the inverse `a^(M−2)`.
- `a × x ≡ b (mod M)` has solutions if and only if `g = GCD(a, M)` divides `b`, and there are `g` of them between 0 and `M − 1`. A solvable system of two congruences has a single solution modulo the LCM of the moduli.
- In C++: reduce before multiplying, add `M` after a subtraction, compute an LCM by dividing first and testing for overflow before multiplying.
