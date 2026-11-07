#include <iostream>
using namespace std;

int main() {
    int m, k;
    cin >> m >> k;

    // On compte à partir de 0 : rangée R, et rang P dans la rangée.
    int r = (k - 1) / m;
    int p = (k - 1) % m;

    // E vaut 0 si la rangée va de gauche à droite, 1 si elle va de droite à gauche.
    int e = r % 2;

    // Quand E = 0, il reste P + 1 ; quand E = 1, il reste M - P.
    int place = (1 - e) * (p + 1) + e * (m - p);
    cout << r + 1 << " " << place << "\n";
    return 0;
}
