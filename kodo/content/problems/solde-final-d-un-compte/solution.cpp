#include <iostream>
using namespace std;

int main() {
    int s, n;
    cin >> s >> n;
    int solde = s;
    for (int i = 0; i < n; i++) {
        int operation;
        cin >> operation;
        // Un retrait est un nombre négatif : on l'ajoute aussi.
        solde = solde + operation;
    }
    cout << solde << "\n";
    return 0;
}
