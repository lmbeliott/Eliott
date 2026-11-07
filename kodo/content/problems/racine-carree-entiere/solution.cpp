#include <cmath>
#include <iostream>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long n;
        cin >> n;
        long long r = (long long) sqrt((double) n);   // valeur approchée, parfois fausse d'une unité
        while (r * r > n) {                            // trop grand : on descend
            r = r - 1;
        }
        while ((r + 1) * (r + 1) <= n) {               // trop petit : on monte
            r = r + 1;
        }
        cout << r << " " << n - r * r << "\n";
    }
    return 0;
}
