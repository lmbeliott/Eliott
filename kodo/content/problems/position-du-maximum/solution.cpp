#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> scores(n);
    for (int i = 0; i < n; i++) {
        cin >> scores[i];
    }
    // Position du meilleur score vu jusqu'ici : au départ, le premier candidat.
    int meilleur = 0;
    for (int i = 1; i < n; i++) {
        // Strictement plus grand : en cas d'égalité, le premier garde sa place.
        if (scores[i] > scores[meilleur]) {
            meilleur = i;
        }
    }
    // Les positions commencent à 0, les numéros à 1.
    cout << meilleur + 1 << " " << scores[meilleur] << "\n";
    return 0;
}
