#include <iostream>
using namespace std;

const long long PREMIERS[15] = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47};
const long long BORNE = 1000000000000000000LL;
long long meilleur;

// n = 2^e1 × 3^e2 × 5^e3 × ... avec e1 ≥ e2 ≥ e3 ≥ ... ; reste : diviseurs encore à « fabriquer »
void explorer(int i, long long reste, long long valeur, int emax) {
    if (reste == 1) {
        if (valeur < meilleur) meilleur = valeur;
        return;
    }
    if (i == 15) return;
    long long p = PREMIERS[i];
    for (int e = 1; e <= emax; e++) {
        if (valeur > (meilleur - 1) / p) break;  // valeur × p ≥ meilleur : élagage, et pas de dépassement
        valeur *= p;
        if (reste % (e + 1) == 0) explorer(i + 1, reste / (e + 1), valeur, e);
    }
}

int main() {
    int t;
    cin >> t;
    while (t--) {
        long long k;
        cin >> k;
        meilleur = BORNE + 1;
        explorer(0, k, 1, 64);
        cout << meilleur << "\n";
    }
    return 0;
}
