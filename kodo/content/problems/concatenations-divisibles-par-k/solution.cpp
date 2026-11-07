#include <iostream>
#include <vector>
using namespace std;

int n;
long long k;
vector<long long> x, p;
vector<bool> utilisee;

// nombre de façons de terminer la pose avec un multiple de K,
// sachant que le nombre déjà formé a pour reste r
long long compter(int posees, long long r) {
    if (posees == n) {
        if (r == 0) {
            return 1;
        }
        return 0;
    }
    long long total = 0;
    for (int i = 0; i < n; i++) {
        if (!utilisee[i]) {
            utilisee[i] = true;
            total += compter(posees + 1, (r * p[i] + x[i]) % k);
            utilisee[i] = false;
        }
    }
    return total;
}

int main() {
    cin >> n >> k;
    x.resize(n);
    p.resize(n);
    utilisee.assign(n, false);
    for (int i = 0; i < n; i++) {
        cin >> x[i];
        // p[i] = 10^(nombre de chiffres de x[i]) modulo k
        long long q = 1 % k;
        long long v = x[i];
        while (v > 0) {
            q = q * 10 % k;
            v = v / 10;
        }
        p[i] = q;
    }
    cout << compter(0, 0) << "\n";
    return 0;
}
