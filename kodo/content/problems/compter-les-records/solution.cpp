#include <iostream>
using namespace std;

int main() {
    int n, meilleur;
    cin >> n >> meilleur;
    // Le premier saut est toujours un record.
    int records = 1;
    for (int i = 0; i < n - 1; i++) {
        int x;
        cin >> x;
        if (x > meilleur) {
            records = records + 1;
            meilleur = x;
        }
    }
    cout << records << "\n";
    return 0;
}
