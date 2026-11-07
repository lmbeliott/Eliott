#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> t(n);
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    vector<int> resultat;          // nouveau tableau : t n'est pas modifié
    for (int i = 0; i < n; i++) {
        int s = t[i];
        if (i > 0) {
            s = s + t[i - 1];      // voisin de gauche
        }
        if (i < n - 1) {
            s = s + t[i + 1];      // voisin de droite
        }
        resultat.push_back(s);
    }
    for (int x : resultat) {
        cout << x << " ";
    }
    cout << "\n";
    return 0;
}
