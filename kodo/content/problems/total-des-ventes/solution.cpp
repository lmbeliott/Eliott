#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // L'accumulateur commence à 0, avant la boucle.
    int total = 0;
    for (int i = 0; i < n; i++) {
        int ventes;
        cin >> ventes;
        total = total + ventes;
    }
    // On affiche le total une seule fois, après la boucle.
    cout << total << "\n";
    return 0;
}
