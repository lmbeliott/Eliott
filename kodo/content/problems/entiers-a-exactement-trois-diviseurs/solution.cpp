#include <iostream>
#include <vector>
using namespace std;

const int M = 1000000;

// plus grand r tel que r * r <= n
long long racine(long long n) {
    long long lo = 0, hi = M + 1;
    while (hi - lo > 1) {
        long long mid = (lo + hi) / 2;
        if (mid * mid <= n) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    return lo;
}

int main() {
    // crible d'Ératosthène jusqu'à M
    vector<bool> premier(M + 1, true);
    premier[0] = premier[1] = false;
    for (long long i = 2; i * i <= M; i++) {
        if (premier[i]) {
            for (long long j = i * i; j <= M; j += i) {
                premier[j] = false;
            }
        }
    }
    // pi[x] = nombre de premiers au plus x
    vector<int> pi(M + 1, 0);
    for (int x = 1; x <= M; x++) {
        pi[x] = pi[x - 1] + (premier[x] ? 1 : 0);
    }
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        long long l, r;
        cin >> l >> r;
        cout << pi[racine(r)] - pi[racine(l - 1)] << "\n";
    }
    return 0;
}
