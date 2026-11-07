#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> g(n, vector<int>(m));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> g[i][j];
        }
    }

    // Ligne de plus grande somme (la première en cas d'égalité).
    int meilleure_ligne = -1, meilleure_somme = 0;
    for (int i = 0; i < n; i++) {
        int s = 0;
        for (int j = 0; j < m; j++) {
            s = s + g[i][j];
        }
        if (meilleure_ligne == -1 || s > meilleure_somme) {
            meilleure_somme = s;
            meilleure_ligne = i;
        }
    }

    // Colonne de plus grande somme : j fixé, i varie.
    int meilleure_colonne = -1;
    for (int j = 0; j < m; j++) {
        int s = 0;
        for (int i = 0; i < n; i++) {
            s = s + g[i][j];
        }
        if (meilleure_colonne == -1 || s > meilleure_somme) {
            meilleure_somme = s;
            meilleure_colonne = j;
        }
    }

    cout << meilleure_ligne + 1 << "\n";
    cout << meilleure_colonne + 1 << "\n";
    return 0;
}
