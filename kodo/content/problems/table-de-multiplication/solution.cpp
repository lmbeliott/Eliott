#include <iostream>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    int somme = 0;                // concerne toute la table
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
            cout << i * j << " ";
            somme = somme + i * j;
        }
        cout << "\n";             // fin de la ligne i
    }
    cout << somme << "\n";
    return 0;
}
