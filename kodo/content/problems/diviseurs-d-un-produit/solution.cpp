#include <iostream>
#include <map>
#include <vector>
using namespace std;

const long long M = 1000000007;
const int V = 1000000;

// a^n mod M, par exponentiation rapide
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
    // pf[x] = plus petit facteur premier de x (0 pour x premier)
    vector<int> pf(V + 1, 0);
    for (long long i = 2; i * i <= V; i++) {
        if (pf[i] == 0) {
            for (long long j = i * i; j <= V; j += i) {
                if (pf[j] == 0) pf[j] = i;
            }
        }
    }
    int n;
    cin >> n;
    map<long long, long long> exposants;
    for (int k = 0; k < n; k++) {
        int x;
        cin >> x;
        while (x > 1) {
            int p = (pf[x] != 0) ? pf[x] : x;   // x premier : son plus petit facteur est lui-même
            x /= p;
            exposants[p]++;
        }
    }
    long long nombre = 1, somme = 1;
    for (auto& pe : exposants) {
        long long p = pe.first, e = pe.second;
        nombre = nombre * ((e + 1) % M) % M;
        // 1 + p + ... + p^e = (p^(e+1) - 1) / (p - 1), division par l'inverse de Fermat
        long long s = (puissance(p, e + 1) - 1 + M) % M * puissance(p - 1, M - 2) % M;
        somme = somme * s % M;
    }
    cout << nombre << " " << somme << "\n";
    return 0;
}
