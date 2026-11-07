#include <iostream>
using namespace std;

// 1 + b + ... + b^(m-1), ou n + 1 dès que la somme dépasse n
long long sommeDesPuissances(long long b, int m, long long n) {
    long long s = 0, p = 1;
    for (int i = 0; i < m; i++) {
        s += p;
        if (s > n) {
            return n + 1;
        }
        if (i + 1 < m) {
            if (p > n / b) {
                return n + 1;      // la puissance suivante dépasserait n
            }
            p = p * b;
        }
    }
    return s;
}

long long plusPetiteBase(long long n) {
    for (int m = 60; m >= 3; m--) {
        // invariant : S(hi) >= n, et S(b) < n pour 2 <= b <= lo
        long long lo = 1, hi = 1LL << (60 / (m - 1) + 1);
        while (hi - lo > 1) {
            long long mid = lo + (hi - lo) / 2;
            if (sommeDesPuissances(mid, m, n) >= n) {
                hi = mid;
            } else {
                lo = mid;
            }
        }
        if (sommeDesPuissances(hi, m, n) == n) {
            return hi;
        }
    }
    return n - 1;          // deux chiffres : n = 1 + (n - 1)
}

int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long n;
        cin >> n;
        cout << plusPetiteBase(n) << "\n";
    }
    return 0;
}
