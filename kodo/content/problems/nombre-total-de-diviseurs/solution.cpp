#include <iostream>
#include <cmath>
using namespace std;

// d(1) + d(2) + ... + d(n) = nombre de couples (a, b) avec a * b <= n
// couples avec a <= s, plus couples avec b <= s, moins ceux comptés deux fois
long long total_jusqua(long long n) {
    long long s = sqrtl((long double)n);
    while (s * s > n) s--;
    while ((s + 1) * (s + 1) <= n) s++;
    long long avec_a_petit = 0;
    for (long long a = 1; a <= s; a++) avec_a_petit += n / a;
    return 2 * avec_a_petit - s * s;
}

int main() {
    long long l, r;
    cin >> l >> r;
    cout << total_jusqua(r) - total_jusqua(l - 1) << "\n";
    return 0;
}
