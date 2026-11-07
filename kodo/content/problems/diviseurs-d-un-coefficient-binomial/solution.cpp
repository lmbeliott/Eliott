#include <iostream>
#include <vector>
using namespace std;

const long long MOD = 1000000007;

// exposant de p dans n! : multiples de p, plus multiples de p², plus multiples de p³...
long long exposant_dans_factorielle(long long n, long long p) {
    long long e = 0;
    while (n > 0) {
        n /= p;
        e += n;
    }
    return e;
}

int main() {
    long long n, k;
    cin >> n >> k;
    // crible d'Ératosthène jusqu'à n
    vector<bool> est_premier(n + 1, true);
    for (long long x = 0; x < 2 && x <= n; x++) est_premier[x] = false;
    for (long long p = 2; p * p <= n; p++) {
        if (!est_premier[p]) continue;
        for (long long q = p * p; q <= n; q += p) est_premier[q] = false;
    }
    // C(N, K) = N! / (K! × (N - K)!) : on soustrait les exposants
    long long reponse = 1;
    for (long long p = 2; p <= n; p++) {
        if (!est_premier[p]) continue;
        long long e = exposant_dans_factorielle(n, p) - exposant_dans_factorielle(k, p) - exposant_dans_factorielle(n - k, p);
        reponse = reponse * (e + 1) % MOD;
    }
    cout << reponse << "\n";
    return 0;
}
