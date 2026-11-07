#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int points = 0, serie = 0, record = 0, nettes = 0;
    for (int i = 0; i < n; i++) {
        int m, e;
        cin >> m >> e;
        bool victoire = m > e;
        bool defaite = m < e;
        if (victoire) {
            points = points + 3;
        } else if (!defaite) {
            points = points + 1;
        }
        // Série sans défaite : un nul la prolonge aussi.
        if (!defaite) {
            serie = serie + 1;
            if (serie > record) {
                record = serie;
            }
        } else {
            serie = 0;
        }
        if (victoire && e == 0) {
            nettes = nettes + 1;
        }
    }
    cout << points << "\n" << record << "\n" << nettes << "\n";
    return 0;
}
