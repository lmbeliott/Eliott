#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> piles(n);
    for (int i = 0; i < n; i++) {
        cin >> piles[i];
    }

    // À la fin, chaque pile contient la moyenne.
    int total = 0;
    for (int x : piles) {
        total = total + x;
    }
    int moyenne = total / n;

    // Pour chaque frontière entre la pile i et la pile i + 1 : les i + 1 premières
    // piles contiennent « deja » pièces et doivent finir avec (i + 1) * moyenne.
    // La différence doit traverser la frontière, une pièce par déplacement.
    int deplacements = 0;
    int deja = 0;
    for (int i = 0; i < n - 1; i++) {
        deja = deja + piles[i];
        int ecart = deja - (i + 1) * moyenne;
        if (ecart < 0) {
            ecart = -ecart;
        }
        deplacements = deplacements + ecart;
    }

    cout << deplacements << "\n";
    return 0;
}
