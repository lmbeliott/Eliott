#include <iostream>
using namespace std;

int main() {
    int s, k, a, b;
    cin >> s >> k >> a >> b;

    // Nombre de marchés du jour 1 au jour X (pour X ≥ S - 1) : (X - S + K) / K.
    // Le nombre divisé n'est jamais négatif, et il reste sous 2 milliards.
    int jusquAB = (b - s + k) / k;
    int avantA = (a - 1 - s + k) / k;

    // Les marchés entre A et B : ceux jusqu'au jour B, sauf ceux d'avant A.
    cout << jusquAB - avantA << "\n";
    return 0;
}
