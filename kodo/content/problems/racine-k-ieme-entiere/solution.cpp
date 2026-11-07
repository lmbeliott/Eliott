#include <iostream>
using namespace std;

// vrai si r^k <= n, sans jamais dépasser 2^63 - 1
bool puissanceAuPlus(long long r, int k, long long n) {
    long long p = 1;
    for (int i = 0; i < k; i++) {
        if (r != 0 && p > n / r) {
            return false;          // p * r dépasserait n
        }
        p = p * r;
    }
    return true;
}

long long racine(long long n, int k) {
    long long lo = 0, hi = 1000000001;   // invariant : lo^k <= n < hi^k
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

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long n;
        int k;
        cin >> n >> k;
        cout << racine(n, k) << "\n";
    }
    return 0;
}
