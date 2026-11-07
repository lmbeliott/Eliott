#include <iostream>
using namespace std;

// vrai si r^k <= n, sans débordement
bool puissanceAuPlus(long long r, int k, long long n) {
    long long p = 1;
    for (int i = 0; i < k; i++) {
        if (r != 0 && p > n / r) {
            return false;
        }
        p = p * r;
    }
    return true;
}

// plus grand r tel que r^k <= n, par dichotomie
long long racine(long long n, int k) {
    long long lo = 0, hi = 2000000000;   // invariant : lo^k <= n < hi^k
    while (hi - lo > 1) {
        long long mid = lo + (hi - lo) / 2;
        if (puissanceAuPlus(mid, k, n)) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    return lo;
}

// nombre d'entiers de 1 à x qui ne sont ni des carrés ni des cubes
long long compte(long long x) {
    long long s = racine(x, 2);
    return x - s - racine(x, 3) + racine(s, 3);
}

int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long k;
        cin >> k;
        long long lo = k - 1, hi = 2 * k;    // invariant : compte(lo) < k <= compte(hi)
        while (hi - lo > 1) {
            long long mid = lo + (hi - lo) / 2;
            if (compte(mid) >= k) {
                hi = mid;
            } else {
                lo = mid;
            }
        }
        cout << hi << "\n";
    }
    return 0;
}
