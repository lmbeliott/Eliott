#include <algorithm>
#include <iostream>
using namespace std;

long long pgcd(long long a, long long b) {
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}

long long kieme(long long a, long long b, long long k) {
    long long l = a / pgcd(a, b) * b;      // PPCM, au plus 10^18
    long long lo = 0, hi = k * min(a, b);  // invariant : compte(lo) < k <= compte(hi)
    while (hi - lo > 1) {
        long long mid = lo + (hi - lo) / 2;
        long long compte = mid / a + mid / b - mid / l;
        if (compte >= k) {
            hi = mid;
        } else {
            lo = mid;
        }
    }
    return hi;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long a, b, k;
        cin >> a >> b >> k;
        cout << kieme(a, b, k) << "\n";
    }
    return 0;
}
