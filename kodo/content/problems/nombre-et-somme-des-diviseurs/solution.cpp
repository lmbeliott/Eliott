#include <iostream>
using namespace std;

int main() {
    int t;
    cin >> t;
    for (int q = 0; q < t; q++) {
        long long n;
        cin >> n;
        long long nb = 1, somme = 1;
        for (long long d = 2; d * d <= n; d = (d == 2 ? 3 : d + 2)) {   // 2, puis les impairs
            if (n % d == 0) {
                int e = 0;
                long long puissance = 1, total = 1;   // total = 1 + d + ... + d^e
                while (n % d == 0) {
                    n /= d;
                    e++;
                    puissance *= d;
                    total += puissance;
                }
                nb *= e + 1;
                somme *= total;
            }
        }
        if (n > 1) {                     // le reste est premier
            nb *= 2;
            somme *= 1 + n;
        }
        cout << nb << " " << somme << "\n";
    }
    return 0;
}
