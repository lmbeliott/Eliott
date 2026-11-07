#include <algorithm>
#include <iostream>
using namespace std;

int main() {
    long long n, k;
    cin >> n >> k;
    long long s = k * (k + 1) / 2;  // plus petite somme de K entiers positifs distincts : 1 + 2 + ... + K

    long long meilleur = -1;
    for (long long d = 1; d * d <= n; d++) {  // on parcourt les diviseurs par paires (d, n / d)
        if (n % d == 0) {
            for (long long g : {d, n / d}) {
                if (n / g >= s) meilleur = max(meilleur, g);  // comparer N / g à s évite de calculer g × s
            }
        }
    }
    cout << meilleur << "\n";
    return 0;
}
