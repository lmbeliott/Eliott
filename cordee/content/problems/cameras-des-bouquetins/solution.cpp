#include <iostream>
#include <string>
#include <vector>
using namespace std;

int n;
vector<string> falaise;
vector<bool> colonne, diag1, diag2;
long long total = 0;

void placer(int ligne) {
    if (ligne == n) {
        total++;                   // une caméra sur chaque ligne : solution trouvée
        return;
    }
    for (int col = 0; col < n; col++) {
        if (falaise[ligne][col] == '.' && !colonne[col]
                && !diag1[ligne + col] && !diag2[ligne - col + n]) {
            colonne[col] = diag1[ligne + col] = diag2[ligne - col + n] = true;
            placer(ligne + 1);
            colonne[col] = diag1[ligne + col] = diag2[ligne - col + n] = false;
        }
    }
}

int main() {
    cin >> n;
    falaise.resize(n);
    for (int i = 0; i < n; i++) cin >> falaise[i];
    colonne.assign(n, false);      // colonne déjà surveillée ?
    diag1.assign(2 * n, false);    // diagonales « / » : ligne + col constant
    diag2.assign(2 * n, false);    // diagonales « \ » : ligne - col constant
    placer(0);
    cout << total << "\n";
    return 0;
}
